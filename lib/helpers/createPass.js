export const generarPass = () => {
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@/*.-";
    const pwdLen = 10;
    const randPassword = Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return randPassword;
    
    
}