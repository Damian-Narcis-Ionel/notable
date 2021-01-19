const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')
var fs = require('fs');
const fileUpload=require("express-fileupload")
const app = express()

app.use(fileUpload({
    createParentPath: true
}))
app.use(cors())
app.use(bodyParser.json())

const db = require('./app/config/db.config.js');


const User = db.users
const Group = db.groups
const UserGroups = db.users_groups
const Note = db.notes
const WebNote=db.web_notes
const Link=db.links
User.belongsToMany(Group, { through: UserGroups })
Group.belongsToMany(User, { through: UserGroups })
User.hasMany(Note)
Group.hasMany(Note)
User.hasMany(WebNote)
Group.hasMany(WebNote)
User.hasMany(Link)
Group.hasMany(Link)



app.post('/create', async (req, res, next) => {
    try {
        await db.sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err)
    }
})

app.get('/users', async (req, res, next) => {
    try {
        let users = await User.findAll()
        res.status(200).json(users)
    }
    catch (err) {
        next(err)
    }

})

app.post('/users', async (req, res, next) => {
    try {
        User.create(req.body)
        res.status(201).json({ message: 'created' })
    }
    catch (err) {
        next(err)
    }
})

app.post('/groups/:user', async (req, res, next) => {
    try {
        Group.create(req.body).then(group => {
            try {
                UserGroups.create(
                    {
                        userId: req.params.user,
                        groupId: group.id,
                        role: 'admin'
                    })
                res.status(201).json({ message: 'created' })
            }
            catch (e) {
                console.log(e)
            }
        })
    }
    catch (err) {
        next(err)
    }
})

app.post('/groups/:group_id/:email/add', async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { email: req.params.email } })
        UserGroups.create(
            {
                userId: user.id,
                groupId: req.params.group_id, 
                role: 'member'})
        res.status(201).json({ message: 'created' })
    }
    catch (err) {
        next(err)
    }
})

app.put('/groups/:group_id/:user_id/edit/:role', async (req, res, next) => {
    try {
        let user = await UserGroups.findOne({ where: Sequelize.and({groupId: req.params.group_id} , {userId: req.params.user_id}) })
        await user.update({
            userId: req.params.user_id,
            groupId: req.params.group_id, 
            role: req.params.role})
        res.status(201).json({ message: 'modified' })
    }
    catch (err) {
        next(err)
    }
})

app.delete('/groups/:group_id/:user_id', async (req, res, next) => {
    try {
        let user = await UserGroups.findOne({ where: Sequelize.and({groupId: req.params.group_id} , {userId: req.params.user_id}) })
        await user.destroy();
           
        res.status(204).json({ message: 'deleted' })
    }
    catch (err) {
        next(err)
    }
})


app.get('/users/:email', async (req, res, next) => {
    try {
        let user = await User.findOne({ where: { email: req.params.email } })
        if (user) {
            res.status(201).json({ user })
        }
        else
            res.status(404).json({message: 'user not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:id/notes', async (req, res, next) => {
    try {
        let user = await User.findOne({
            where: { id: req.params.id },
            include: [Note]
        })
        if (user) {
            notes = []
            for (let n of user.notes) {
                let note = { id: n.id, name: n.name, extenstion: n.type }
                notes.push(note)
            }
            res.status(201).json(notes)
        }
        else
            res.status(404).json({message: 'user not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:id/webnotes', async (req, res, next) => {
    try {
        let user = await User.findOne({
            where: { id: req.params.id },
            include: [WebNote]
        })
        if (user) {
            notes = []
            for (let n of user.web_notes) {
                let string= n.createdAt.toString()
                let v=string.split(' ')
                let date=`${v[0]} ${v[1]} ${v[2]} ${v[3]}`
                let note = { id: n.id, name: n.name,date:date}
                notes.push(note)
            }
            res.status(201).json(notes)
        }
        else
            res.status(404).json({message: 'user not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/users/:id/links', async (req, res, next) => {
    try {
        let user = await User.findOne({
            where: { id: req.params.id },
            include: [Link]
        })
        if (user) {
            links = []
            for (let l of user.links) {
                let link = { id: l.id, name: l.name,link: l.link}
                links.push(link)
            }
            res.status(201).json(links)
        }
        else
            res.status(404).json({message: 'user not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/groups/:id/users', async (req, res, next) => {
    try {
        let group = await Group.findOne({
            where: { id: req.params.id }
        })
        let group_users = await UserGroups.findAll({ where: { groupId: group.id } })
        let users = []
        for (u of group_users) {
            let user = await User.findOne({ where: { id: u.userId } })
            let real_user={
                avatar: user.avatar,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                role: u.role
            }
            users.push(real_user)
        }
        if (group) {
            res.status(201).json(users)
        }
        else
            res.status(404).json({message: 'group not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/groups/:group_id/notes', async (req, res, next) => {
    try {
        let group = await Group.findOne({
            where: { id: req.params.group_id },
            include: [Note]
        })
        if (group) {
            data = {}
            data.notes = []
            for (let n of group.notes) {
                let note = { id: n.id, name: n.name, extenstion: n.type }
                data.notes.push(note)
            }
            res.status(201).json(data)
        }
        else
            res.status(404).json({message: 'group not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/groups/:group_id/webnotes', async (req, res, next) => {
    try {
        let group = await Group.findOne({
            where: { id: req.params.group_id },
            include: [WebNote]
        })
        if (group) {
            data = {}
            data.notes = []
            console.log(group)
            for (let n of group.web_notes) {
                let note = { id: n.id, name: n.name,userId: n.userId}
                data.notes.push(note)
            }
            res.status(201).json(data)
        }
        else
            res.status(404).json({message: 'group not found'})
    }
    catch (err) {
        next(err)
    }
})

app.get('/groups/:group_id/links', async (req, res, next) => {
    try {
        let group = await Group.findOne({
            where: { id: req.params.group_id },
            include: [Link]
        })
        if (group) {
            links=[]
            for (let n of group.links) {
                let link = { id: n.id, name: n.name,link: n.link}
                links.push(link)
            }
            res.status(201).json(links)
        }
        else
            res.status(404).json({message: 'group not found'})
    }
    catch (err) {
        next(err)
    }
})



app.get('/user-groups/:user_id',async(req,res,next) => {
    try{
        let groups=await UserGroups.findAll({ where: { userId: req.params.user_id } })
        if(groups)
        {
            let data={}
            let grps=[]
            for(let g of groups)
                {
                    let grp=await Group.findByPk(g.groupId);
                    if(!grps.includes(grp))
                        grps.push(grp)     
                }
            res.status(201).json({grps})
        }
        else
            res.status(404).json({'message' : 'no groups found'})    
    }
    catch(err)
    {
        next(err)
    }
})

app.post('/notes/:user/:group', async (req, res, next) => {
    try {
        if(req.files)
            {
                const file =req.files.demo
                let v=file.name.split('.')
                        let name=v[0]
                        let type=v[1]
                        Note.create(
                            {
                                type: type,
                                content: file.data,
                                userId: req.params.user,
                                groupId: req.params.group,
                                name: name
                            })
                res.status(202).json({message: 'created'})
            }
        else
            res.status(400).json({message: "no file uploaded"})
    }
    catch (err) {
        next(err)
    }
})

app.post('/webnotes/:user/:group', async (req, res, next) => {
    try {
         WebNote.create(
            {
                content: req.body.content,
                userId: req.params.user,
                groupId: req.params.group,
                name: req.body.name
            })
                res.status(202).json({message: 'created'})
    }
    catch (err) {
        next(err)
    }
})

app.post('/links/:user/:group', async (req, res, next) => {
    try {
         Link.create(
            {
                link: req.body.link,
                userId: req.params.user,
                groupId: req.params.group,
                name: req.body.name
            })
                res.status(202).json({message: 'created'})
    }
    catch (err) {
        next(err)
    }
})

app.post('/users/:id/newphoto', async (req, res, next) => {
    try {
        if(req.files)
            {
                const file =req.files.demo
                let user=await User.findByPk(req.params.id)
                await user.update(
                    {
                        avatar: file.data
                    }
                )
                res.status(202).json({message: 'avatar updated'})
            }
        else
            res.status(400).json({message: "no file uploaded"})
    }
    catch (err) {
        next(err)
    }
})


app.get('/notes/:id', async (req, res, next) => {
    try {
        let note = await Note.findByPk(req.params.id)
        res.status(201).json(note)
    }
    catch (err) {
        next(err)
    }
})

app.get('/webnotes/:id', async (req, res, next) => {
    try {
        let note = await WebNote.findByPk(req.params.id)
        res.status(201).json(note)
    }
    catch (err) {
        next(err)
    }
})

app.put('/webnotes/:id', async (req, res, next) => {
    try {
        let note = await WebNote.findByPk(req.params.id)
        await note.update({
            content: req.body.content
        })
        res.status(201).json({message: 'webnote updated'})
    }
    catch (err) {
        next(err)
    }
})


app.delete('/webnotes/:id', async (req, res, next) => {
    try {
        let note = await WebNote.findByPk(req.params.id)
        await note.destroy();
           
        res.status(204).json({ message: 'deleted' })
    }
    catch (err) {
        next(err)
    }
})

app.listen(8080)

// {
//     "email": "luci99fox@yahoo.com",
//     "firstName": "Lucian",
//     "lastName": "Deaconescu",
//     "password": "parola",
//     "avatar": null
// }

// {
//     "name": "Prima notita",
//     "content": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
// }