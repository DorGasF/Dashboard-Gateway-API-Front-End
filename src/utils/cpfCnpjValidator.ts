export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '')
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    let sum = 0
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i)
    let check1 = (sum * 10) % 11
    if (check1 === 10) check1 = 0
    if (check1 !== Number(cpf[9])) return false

    sum = 0
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i)
    let check2 = (sum * 10) % 11
    if (check2 === 10) check2 = 0

    return check2 === Number(cpf[10])
}

export function isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '')
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

    let length = cnpj.length - 2
    let numbers = cnpj.substring(0, length)
    let digits = cnpj.substring(length)
    let sum = 0
    let pos = length - 7

    for (let i = length; i >= 1; i--) {
        sum += Number(numbers[length - i]) * pos--
        if (pos < 2) pos = 9
    }

    let check1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (check1 !== Number(digits[0])) return false

    length++
    numbers = cnpj.substring(0, length)
    sum = 0
    pos = length - 7

    for (let i = length; i >= 1; i--) {
        sum += Number(numbers[length - i]) * pos--
        if (pos < 2) pos = 9
    }

    let check2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    return check2 === Number(digits[1])
}
