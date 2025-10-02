type EventsTabel = 'PlayerMessage';

interface IEventResult {
  body: { message: string; sender: string; type: 'chat' };
  header: {
    eventName: EventsTabel;
    messagePurpose: 'event';
    version: number;
  };
}

export default IEventResult;
