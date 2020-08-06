import knex from 'knex';

//Quais alterações queremos realizar no banco de dados
export async function up(knex: knex){
    return knex.schema.createTable('users', table =>{
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.string('whatsapp').notNullable();
        table.string('bio').notNullable();
    })
}

//Desfazer alterações, caso dê erro
export async function down(knex: knex){
    return knex.schema.dropTable('users');
}