import { initServer } from './config/app.js'
import { config } from 'dotenv'
import { connect } from './config/mongo.js'
import {DefaultUser} from './src/users/user.controller.js'

config()
connect()
initServer()
DefaultUser();