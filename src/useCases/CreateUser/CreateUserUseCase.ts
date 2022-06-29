import { IMailProvider } from './../../providers/IMailProvider';
import { User } from './../../entities/User';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { IUsersRepository } from './../../repositories/IUsersRepository';


export class CreateUserUseCase{
    constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
    ){}


    async execute (data: ICreateUserRequestDTO){
         const userAlreadyExists = await this.usersRepository.findByEmail(data.email);
         
         if (userAlreadyExists){
            throw new Error ('User already exits.');
         }
         const user = new User(data);

         await this.usersRepository.save(user);

          await this.mailProvider.sendMail ({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'Equipe IO',
                email:'equipeIO@gmail.com',
            },
            subject:
            'Seja bem-vinde',
            body: '<p>Agora você esta apto a entrar na plataforma.<br/> Obrigado pela confiança.</p>'
            
         })
    }
}