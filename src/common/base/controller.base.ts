import autoBind from 'auto-bind';

export abstract class BaseController {
    protected constructor() {
        autoBind(this);
    }
}
