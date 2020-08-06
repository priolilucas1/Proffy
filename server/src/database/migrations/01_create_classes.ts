import knex from 'knex';

//Quais alterações queremos realizar no banco de dados
export async function up(knex: knex){
    return knex.schema.createTable('classes', table =>{
        table.increments('id').primary();
        table.string('subject').notNullable();
        table.decimal('cost').notNullable();

        //Foreign Key (Aluno que o professor vai dar aula)
        table.integer('userID').notNullable()
        .references('id').inTable('users') //ID da tabela users
        .onUpdate('CASCADE')
        .onDelete('CASCADE'); //Se for deletado, tudo do professor vai embora também, efeito cascata

    })
}

//Desfazer alterações, caso dê erro
export async function down(knex: knex){
    knex.schema.dropTable('classes');
}