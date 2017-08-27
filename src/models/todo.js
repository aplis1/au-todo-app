import {IdGenerator} from '../utilities/idgenerators';

export class Todo {
    constructor(title, completed = false) {
        this.id = IdGenerator.getNextId();
        this.title = title;
        this.completed = completed;
    }
}