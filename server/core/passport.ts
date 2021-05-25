import passport from 'passport'
import {Strategy as GitHubStrategy} from 'passport-github'
import {User} from '../../models'


passport.use(
    'github',
    new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/github/callback"
        },
        async (_: unknown, __: unknown, profile, cb) => {
            const obj = {
                fullName: profile.displayName,
                avatarURL: profile.photos?.[0].value,
                userName: profile.username,
                isActive: 0,
                phone: ''
            }
            const user = await User.create(obj)
            cb()
        }
    ));

export {passport}