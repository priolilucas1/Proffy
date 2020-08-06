import knex from 'knex';

//Quais alterações queremos realizar no banco de dados
export async function up(knex: knex){
    return knex.schema.createTable('connections', table =>{
        table.increments('id').primary();

        //Foreign Key (Conectar com o usuário)
        table.integer('userID').notNullable()
        .references('id')
        .inTable('users') //ID da tabela users
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

        //Criar conexão
        table.timestamp('create_at')
        .notNullable()
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    })
}

//Desfazer alterações, caso dê erro
export async function down(knex: knex){
    return knex.schema.dropTable('connections');
}