const {Model} = require('objection');

class User extends Model {
    static get tableName() {
        return 'user'
    }

    static get idColumn() {
        return 'username';
    }

    static get relationMappings() {
        return {
            movies: {
                relation: Model.HasManyRelation,
                modelClass: MovieInteraction,
                join: {
                    from: 'user.username',
                    to: 'movie_interaction.username'
                }
            }
        };
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: {type: 'string'},
                password: {type: 'string'},
            }
        };
    }
}

class MovieInteraction extends Model {
    static get tableName() {
        return 'movie_interaction'
    }

    static get idColumn() {
        return ['username', 'movie_id'];
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'movie_interaction.username',
                    to: 'user.username'
                }
            }
        };
    }
}

module.exports = {User, MovieInteraction};