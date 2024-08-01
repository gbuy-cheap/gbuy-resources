/**
 * It holds all message handlers of the content area.
 */
class ContentMessageHandlers extends MessageHandlers {
    constructor () {
        super([
            new ShowMainModal()
        ]);
    }
}
