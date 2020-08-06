import knex from 'knex';

//Quais alterações queremos realizar no banco de dados
export async function up(knex: knex){
    return knex.schema.createTable('class_schedule', table =>{
        table.increments('id').primary();

        table.integer('week_day').notNullable();
        table.integer('from').notNullable(); //De que dia/horas
        table.integer('to').notNullable(); //Até que dia/horas

        //Foreign Key
        table.integer('classID').notNullable()
        .references('id')
        .inTable('classes') //ID da tabela users
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
}

//Desfazer alterações, caso dê erro
export async function down(knex: knex){
    return knex.schema.dropTable('class_schedule');
}