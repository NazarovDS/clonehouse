import passport from 'passport'
import {Strategy as GitHubStrategy} from 'passport-github'
import {User} from '../../models'
import {UserType} from "../../types/usersTypes";


passport.use(
    'github',
    new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/github/callback"
        },
        async (_: unknown, __: unknown, profile, done) => {
            try {
                //собираем данные пользователя
                const obj: UserType = {
                    fullName: profile.displayName,
                    avatarURL: profile.photos?.[0].value,
                    userName: profile.username,
                    isActive: 0,
                    phone: ''
                }
                //проверяем есть ли пользователь в базе
                const findUser = await User.findOne({
                    where: {
                        userName: obj.userName
                    }
                })
                //если нет - добавляем
                if (!findUser) {
                    const user = await User.create(obj)
                    return  done(null, user.toJSON())
                }
                //если есть - возвращаем
                done(null, findUser)
            } catch (e) {
                done(e)
            }

        }
    ));
passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        err ? done(err) : done(null,user);
    });
});

export {passport}