import {Request, Response} from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../Utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async index(request: Request, response: Response){
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;
        
        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = convertHourToMinutes(time);

        //Join (DB)
        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`classID` = `classes`. `id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.userID', '=', 'users.id')
            .select(['classes.*','users.*']);

        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule,
        } = request.body;
    
        //Se um der erro todos os outros q foram um sucesso se desfazem
        const trx = await db.transaction();
    
        try{
            //Cadastrar usuário
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
    
            const userID = insertedUsersIds[0];
    
            //Cadastrar classe
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                userID,
            })
    
            const classID = insertedClassesIds[0];
    
            //Cadastrar programação
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return{
                    classID,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                }
            })
    
            await trx('class_schedule').insert(classSchedule);
    
            //Inserir tudo ao mesmo tempo se tiver sucesso
            await trx.commit();
    
            return response.status(201).send();
        }catch(err){
            //Desfaz tudo se der errado    
            await trx.rollback();
    
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    
    }
}