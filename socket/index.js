/*
Map()
https://ithelp.ithome.com.tw/articles/10196113
*/
const socketIo = require('socket.io');
const { sequelize } = require('../models');
const Message = require('../models').Message;

const users = new Map(); // save every socket for the user and value is userId
const userSockets = new Map();

const SocketServer = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {

        socket.on('join', async (user) => {

            let sockets = [];

            if (users.has(user.id)) {
                const existingUser = users.get(user.id);
                existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
                users.set(user.id, existingUser);
                sockets = [...existingUser.sockets, ...[socket.id]];
                userSockets.set(socket.id, user.id);
            } else {
                users.set(user.id, { id: user.id, sockets: [socket.id] });
                sockets.push(socket.id);
                userSockets.set(socket.id, user.id);
            }

            const onlineFriends = []; // ids
            
            const chatters = await getChatters(user.id); // grab all the users that this user is chatting with

            // console.log("chatters: ",chatters);

            // notify  this user's  friends that user is now online
            for (let i = 0; i < chatters.length; i++) {
                if (users.has(chatters[i])) {
                    const chatter = users.get(chatters[i])
                    chatter.sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('online', user);
                        } catch (e) {
                            console.log(`Occurred error in notifing this user's friends `, e);
                        };
                    });
                    onlineFriends.push(chatter.id);
                };
            };

            // send to user sockets which of his friends are online
            sockets.forEach(socket => {
                try {
                    io.to(socket).emit('friends', onlineFriends);
                } catch (e) { 
                    console.log(`Occurred error in notifing this user's friends `, e);
                 };
            });
        });

        socket.on('message', async (message) => {
            let sockets = [];
            // user sends the message
            if (users.has(message.fromUser.id)) {
                sockets = users.get(message.fromUser.id).sockets;
            };
            // user receives the message
            message.toUserId.forEach(id => {
                if (users.has(id)) {
                    sockets = [...sockets, ...users.get(id).sockets];
                };
            });
            // create and send the message to all users
            try {
                const msg = {
                    type: message.type,
                    fromUserId: message.fromUser.id,
                    chatId: message.chatId,
                    message: message.message
                };

                const savedMessage = await Message.create(msg);

                message.User = message.fromUser;
                message.fromUserId = message.fromUser.id;
                message.id = savedMessage.id;
                message.message = savedMessage.message;
                delete message.fromUser;

                sockets.forEach(socket => {
                    io.to(socket).emit('received', message);
                });
            } catch (e) { 
                console.log(`Occurred error message `, e);
             };
        });

        socket.on('typing', (message) => {
            message.toUserId.forEach(id => {
                if (users.has(id)) {
                    users.get(id).sockets.forEach(socket => {
                        io.to(socket).emit('typing', message)
                    });
                };
            });
        });

        socket.on('add-friend', (chats) => {
            try {
                let online = 'offline'
                if (users.has(chats[1].Users[0].id)) {
                    online = 'online'
                    chats[0].Users[0].status = 'online';
                    users.get(chats[1].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new-chat', chats[0]);
                    });
                };

                if (users.has(chats[0].Users[0].id)) {
                    chats[1].Users[0].status = online;
                    users.get(chats[0].Users[0].id).sockets.forEach(socket => {
                        io.to(socket).emit('new-chat', chats[1]);
                    });
                };

            } catch (e) { 
                console.log(`Occurred error add friend`, e);
            };
        });

        socket.on('add-user-to-group', ({ chat, newChatter }) => {

            if (users.has(newChatter.id)) {
                newChatter.status = 'online';
            };

            // old users
            chat.Users.forEach((user, index) => {
                if (users.has(user.id)) {
                    chat.Users[index].status = 'online';
                    users.get(user.id).sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('added-user-to-group', { chat, chatters: [newChatter] })
                        } catch (e) { 
                            console.log(`Occurred error in old users`, e);
                        };
                    });
                };
            });

            // send to new chatter
            if (users.has(newChatter.id)) {
                users.get(newChatter.id).sockets.forEach(socket => {
                    try {
                        io.to(socket).emit('added-user-to-group', { chat, chatters: chat.Users })
                    } catch (e) {
                        console.log(`Occurred error in sending to new chatter`, e);
                     }
                })
            }
        })

        socket.on('leave-current-chat', (data) => {

            const { chatId, userId, currentUserId, notifyUsers } = data

            notifyUsers.forEach(id => {
                if (users.has(id)) {
                    users.get(id).sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('remove-user-from-chat', { chatId, userId, currentUserId })
                        } catch (e) { 
                            console.log(`Occurred error in leave-current-chat`, e);
                        }
                    })
                }
            })
        })

        socket.on('delete-chat', (data) => {
            const { chatId, notifyUsers } = data;

            notifyUsers.forEach(id => {
                if (users.has(id)) {
                    users.get(id).sockets.forEach(socket => {
                        try {
                            io.to(socket).emit('delete-chat', parseInt(chatId));
                        } catch (e) { 
                            console.log(`Occurred error in delete-chat`, e);
                        };
                    });
                };
            });
        });

        socket.on('disconnect', async () => {
            /*   worse case
                users.forEach( (user, key)=>{
                    user.sockets.forEach(socketUser =>{
                            if(socketUser === socket.id){
                            }
                        })
                    });
            */
            /*  better case */
            if (userSockets.has(socket.id)) {
                const user = users.get(userSockets.get(socket.id));

                if (user.sockets.length > 1) {
                    user.sockets = user.sockets.filter(sock => {
                        if (sock !== socket.id) return true;
                        userSockets.delete(sock);
                        return false;
                    });
                    users.set(user.id, user);
                } else {
                    const chatters = await getChatters(user.id);

                    for (let i = 0; i < chatters.length; i++) {
                        if (users.has(chatters[i])) {
                            users.get(chatters[i]).sockets.forEach(socket => {
                                try {
                                    io.to(socket).emit('offline', user);
                                } catch (e) {  
                                    console.log(`Occurred error in disconnection`, e);
                                };
                            });
                        };
                    };
                    userSockets.delete(socket.id);
                    users.delete(user.id);
                };
            };
        });
    });
};

const getChatters = async (userId) => {
    try {
        const [results, metadata] = await sequelize.query(`
        select "cu"."userId" from "ChatUsers" as cu
        inner join (
            select "c"."id" from "Chats" as c
            where exists (
                select "u"."id" from "Users" as u
                inner join "ChatUsers" on u.id = "ChatUsers"."userId"
                where u.id = ${parseInt(userId)} and c.id = "ChatUsers"."chatId"
            )
        ) as cjoin on cjoin.id = "cu"."chatId"
        where "cu"."userId" != ${parseInt(userId)}
    `);

        return results.length > 0 ? results.map(el => el.userId) : [];
    } catch (e) {
        console.log(`getChatters error`, e);
        return [];
    };
};

module.exports = SocketServer;