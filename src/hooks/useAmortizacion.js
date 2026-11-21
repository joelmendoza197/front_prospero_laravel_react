export function calcularTabla(deuda) {
    const { valor_total, meses, tipo, tasa_anual, metodo, fecha_inicio } = deuda;
    const P = parseFloat(valor_total);
    const n = parseInt(meses);
    const tabla = [];
    const fechaBase = new Date(fecha_inicio);

    if (tipo === 'sin_interes') {
        const cuota = P / n;
        for (let i = 1; i <= n; i++) {
            const fecha = new Date(fechaBase);
            fecha.setMonth(fecha.getMonth() + i);
            tabla.push({
                numero: i,
                cuota: cuota,
                capital: cuota,
                interes: 0,
                saldo: P - cuota * i < 0.01 ? 0 : P - cuota * i,
                fecha: fecha.toISOString().split('T')[0],
            });
        }
        return tabla;
    }

    const r = tasa_anual / 100 / 12; // tasa mensual

    if (metodo === 'frances') {
        // Cuota fija: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
        const cuota = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        let saldo = P;
        for (let i = 1; i <= n; i++) {
            const interes = saldo * r;
            const capital = cuota - interes;
            saldo = saldo - capital;
            const fecha = new Date(fechaBase);
            fecha.setMonth(fecha.getMonth() + i);
            tabla.push({
                numero: i,
                cuota: cuota,
                capital,
                interes,
                saldo: saldo < 0.01 ? 0 : saldo,
                fecha: fecha.toISOString().split('T')[0],
            });
        }
    }

    if (metodo === 'aleman') {
        // Capital fijo, interés sobre saldo
        const capital = P / n;
        let saldo = P;
        for (let i = 1; i <= n; i++) {
            const interes = saldo * r;
            const cuota = capital + interes;
            saldo = saldo - capital;
            const fecha = new Date(fechaBase);
            fecha.setMonth(fecha.getMonth() + i);
            tabla.push({
                numero: i,
                cuota,
                capital,
                interes,
                saldo: saldo < 0.01 ? 0 : saldo,
                fecha: fecha.toISOString().split('T')[0],
            });
        }
    }

    return tabla;
}