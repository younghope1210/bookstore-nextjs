import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from 'bcrypt'
import db from "@/lib/db";


// import CredentialsProvider from "next-auth/providers/credentials"; : 로그인을 할 수 있게 하는 제공자
// import { signJwtToken } from "@/lib/jwt"; : 서명
// import bcrypt from 'bcrypt' : 복호화

const handler = NextAuth({
    providers: [
        CredentialsProvider({ // 자격 증명하기
            type: 'credentials',
            credentials: {  // 공급자
                email: { label: "Email", type: "text", placeholder: "seoyoung" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) { // 비동기 인증
                const { email, password } = credentials

                await db.connect() // 몽고 db와 연결

                const user = await User.findOne({ email }) // 회원가입된 사용자 찾기

                if (!user) {
                    throw new Error("Invalid input")
                }
                // 패스워드 암호 해독하기
                const comparePass = await bcrypt.compare(password, user.password)
                
                // 로그인 창에서 입력한 비번과 db에 저장된 비번이 일치하지 않으면 
                if (!comparePass) {
                    throw new Error("Invalid input")
                } else {
                    const { password, ...others } = user._doc
                    //_doc = 실제 사용자 객체

                    const accessToken = signJwtToken(others, { expiresIn: "6d" })

                    return {
                        ...others,
                        accessToken
                    }
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }) { // 비동기 작업, 토큰을 얻으면서 로그인 됨
            if (user) {
                token.accessToken = user.accessToken
                token._id = user._id
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.accessToken = token.accessToken
            }

            return session
        }
    }
})

export { handler as GET, handler as POST }