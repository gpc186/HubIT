const Job = require('../model/jobModel');

class JobService {
    static async closeJob({ userID, tipoConta, empregoID }) {
        if (tipoConta !== 'empresa') {
            throw new Error("Credenciais inválidas");
        };

        const job = await Job.findById(empregoID);

        if (!job) {
            throw new Error("Emprego não encontrado!");
        };
        if (job.empresaID !== userID) {
            throw new Error("Essa vaga não pertence a você!");
        };
        if (job.status === 'encerrado') {
            throw new Error("Não é possivel cancelar essa vaga!");
        };

        const status = 'encerrado';

        await Job.updateStatus(empregoID, status);

        return {
            empregoID,
            status
        };
    };
};

module.exports = JobService