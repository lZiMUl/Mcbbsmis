interface IEventResult {
    body: {
        message: string;
        sender: string;
        type: 'chat';
    };
    header: {
        eventName: 'PlayerMessage';
        messagePurpose: 'event';
        version: number;
    };
}
export default IEventResult;
//# sourceMappingURL=IEventResult.d.ts.map