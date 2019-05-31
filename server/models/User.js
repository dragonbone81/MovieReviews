const {Model} = require('objection');

class User extends Model {
    static get tableName() {
        return 'user'
    }

    // static get relationMappings () {
    //     return {
    //         idea: {
    //             relation: Model.BelongsToOneRelation,
    //             modelClass: Idea,
    //             join: {
    //                 from: 'comments.ideas_id',
    //                 to: 'ideas.id'
    //             }
    //         }
    //     }
    // }
}

module.exports = User;