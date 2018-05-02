# Cloud Homework 4
Emit on: `setUserAndGroup` -> { user: string, group: string }

Listen on(self): `confirmAuth` -> { status: string }

Listen on(entire group): `userConnected` -> { connectedUser: string, id: string }

Send on: `sendMessage` -> { text: string }

Listen on(entire group): `receiveMessage` -> { user: string, id: string, message: string }

Listen on(entire group): `userDisconnected` -> { user: string, id: string }

#### Endpoints:

GET-> `/messages/:groupName` -> get all messages from that group