import { mailAuthPassword, mailAuthUser,  linkWeb} from '../config/mail_sender';

import { getHTMLFile } from '../utils/html_utils';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mailAuthUser,
    pass: mailAuthPassword,
  },
});

const buildMessage = (userEmail, subject, html) => {
    
  return {
    from: mailAuthUser,
    to: userEmail,
    subject,
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: 'lib/assets/isologo-blanco.png',
        cid: 'isologo-blanco',
      },
    ],
  };
};

const buildMessage2 = (userEmail, subject, nombre) => {
    
    return {
      from: mailAuthUser,
      to: userEmail,
      subject: subject,
      text: `Estimado ${nombre} ya se encuentra registrado en la plataforma.
Le recomendamos que al ingresar cambie las credenciales para una mayor seguridad.
      
Las credenciales para el ingreso son:
DNI: Su DNI
Contraseña: Su DNI
      
Saludos cordiales. 
PLATAFORMA ESIC
      `,
    };
  };

  const buildMessageRecuperarPass = (userEmail, subject, nombre, passNueva) => {
    
    return {
      from: mailAuthUser,
      to: userEmail,
      subject: subject,
      text: `Estimado ${nombre} se solicito la recuperacion de la contraseña en su cuenta.
      
Las credenciales para el ingreso son:
DNI: Su DNI
Contraseña: ${passNueva}

Saludos cordiales. 
PLATAFORMA ESIC
      `,
    };
  };

const getTemplate = (path, parametros) => {
  return getHTMLFile(`lib/html/${path}.html`, parametros);
};

export const sendMail = async ({
  destinatario,
  asunto,
  nombreUsuario
}) => {
    try {
        console.log(nombreUsuario);
        await transport.sendMail(buildMessage2(destinatario, asunto, nombreUsuario));
      } catch (e) {
        console.log(e);
      }
           
};

export const sendMailRecuperarPass = async ({
    destinatario,
    asunto,
    nombreUsuario,
    passNueva
  }) => {
      try {
          await transport.sendMail(buildMessageRecuperarPass(destinatario, asunto, nombreUsuario, passNueva));
        } catch (e) {
          console.log(e);
        }
        
  };

  export const sendMailAltaProyecto = async ({
    destinatario,
    asunto,
    nombreUsuario,
    nombreProyecto
  }) => {
      
      try {
          await transport.sendMail(buildMessageAltaProyecto(destinatario, asunto, nombreUsuario, nombreProyecto));
        } catch (e) {
          console.log(e);
        }
        
  };

  const buildMessageAltaProyecto = (userEmail, subject, nombre, nombreProyecto) => {
  return {
      from: mailAuthUser,
      to: userEmail,
      subject: subject,
      text: `Estimado ${nombre} se le notifica que ha sigo asignado al proyecto:

${nombreProyecto}

Al ingresar a la plataforma ya lo podra ver en sus proyectos activos.

Saludos cordiales. 
PLATAFORMA ESIC
Link: ${linkWeb}
      `,
    };
  };

  export const sendMailAltaHito = async ({
    destinatario,
    asunto,
    nombreUsuario,
    nombreProyecto,
    nombreHito
  }) => {
      
      try {
          await transport.sendMail(buildMessageAltaHito(destinatario, asunto, nombreUsuario, nombreProyecto, nombreHito));
        } catch (e) {
          console.log(e);
        }
        
  };

  const buildMessageAltaHito = (userEmail, subject, nombre, nombreProyecto, nombreHito) => {
    return {
        from: mailAuthUser,
        to: userEmail,
        subject: subject,
        text: `Estimado ${nombre} se ha creado un hito al proyecto:     ${nombreProyecto}

  ${nombreHito}
  
  Al ingresar a la plataforma ya lo podra ver en sus proyectos activos. Recuerde que desde 
  cada hito podra realizar las entregas en formato pdf para ser corregidas por el tutor.
  
  Saludos cordiales. 
  PLATAFORMA ESIC
  Link: ${linkWeb}
        `,
      };
    };

    export const sendMailEntregable = async ({
        destinatario,
        asunto,
        nombreUsuario,
        nombreProyecto,
        nombreHito
      }) => {
          
          try {
              await transport.sendMail(buildMessageEntregable(destinatario, asunto, nombreUsuario, nombreProyecto, nombreHito));
            } catch (e) {
              console.log(e);
            }
            
      };

      const buildMessageEntregable = (userEmail, subject, nombre, nombreProyecto, nombreHito) => {
        return {
            from: mailAuthUser,
            to: userEmail,
            subject: subject,
            text: `Estimado  Tutor ${nombre} le informamos que se ha realizado una entrega:
    
Proyecto:     ${nombreProyecto}
Hito:         ${nombreHito}
    

Saludos cordiales. 
PLATAFORMA ESIC
Link: ${linkWeb}
            `,
          };
        };
  
        export const sendMailHitoAprobado = async ({
            destinatario,
            asunto,
            nombreUsuario,
            nombreProyecto,
            nombreHito
          }) => {
              
              try {
                  await transport.sendMail(buildMessageHitoAprobado(destinatario, asunto, nombreUsuario, nombreProyecto, nombreHito));
                } catch (e) {
                  console.log(e);
                }
                
          };
    
          const buildMessageHitoAprobado = (userEmail, subject, nombre, nombreProyecto, nombreHito) => {
            return {
                from: mailAuthUser,
                to: userEmail,
                subject: subject,
                text: `Estimado  alumno ${nombre} le informamos que ha sido aprobado el hito:
        
Hito:         ${nombreHito}
Proyecto:     ${nombreProyecto}


    

Saludos cordiales. 
PLATAFORMA ESIC
Link: ${linkWeb}
                `,
              };
            };
            
            export const sendMailDevolucionHito = async ({
                destinatario,
                asunto,
                nombreUsuario,
                nombreProyecto,
                nombreHito
              }) => {
                  
                  try {
                      await transport.sendMail(buildMessageDevolucionHito(destinatario, asunto, nombreUsuario, nombreProyecto, nombreHito));
                    } catch (e) {
                      console.log(e);
                    }
                    
              };
        
              const buildMessageDevolucionHito = (userEmail, subject, nombre, nombreProyecto, nombreHito) => {
                return {
                    from: mailAuthUser,
                    to: userEmail,
                    subject: subject,
                    text: `Estimado  alumno ${nombre} le informamos que tiene una devolucion realizada por el tutor para el hito:
            
Hito:         ${nombreHito}
Proyecto:     ${nombreProyecto}


    

Saludos cordiales. 
PLATAFORMA ESIC
Link: ${linkWeb}
                    `,
                  };
                };

      