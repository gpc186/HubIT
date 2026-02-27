const Job = require('../model/jobModel');
const AppError = require('../utils/AppError');
const { JOB_STATUS } = require('../constants/status.constants');

class JobService {
    static async createJob({ userID, tipoUsuario, empresaNome, imgEmpresa, qtdFuncionario, titulo, descricao, area, nivel, tipoContrato, cargaHoraria, mediaSalario, localizacao, requisitos, diferenciais, beneficios, corDestaque }) {
        if (tipoUsuario !== "empresa") {
            throw new AppError("Apenas empresas podem se candidatar!", 403);
        };

        const empregoID = await Job.create({
            empresaID: userID,
            empresaNome,
            imgEmpresa,
            qtdFuncionario,
            titulo,
            descricao,
            area,
            nivel,
            tipoContrato,
            cargaHoraria,
            mediaSalario,
            localizacao,
            requisitos,
            diferenciais,
            beneficios,
            corDestaque,
            status: JOB_STATUS.ATIVA
        });

        return empregoID;
    };

    static async getActiveJobs() {
        return await Job.findAll({ status: JOB_STATUS.ATIVA });
    }

    // 'titulo',
    // 'descricao',
    // 'area',
    // 'nivel',
    // 'tipoContrato',
    // 'tipoTrabalho',
    // 'cargaHoraria',
    // 'mediaSalario',
    // 'localizacao',
    // 'requisitos',
    // 'diferenciais',
    // 'beneficios',
    // 'corDestaque',
    // 'imgEmpresa',
    // 'qtdFuncionario'

    static async updateJob({ userID, tipoUsuario, empregoID, updateData }) {
        if (tipoUsuario !== "empresa") {
            throw new AppError("Você não tem permissão para alterar!", 403);
        };

        const job = await Job.findById(empregoID);

        if (!job) {
            throw new AppError("Emprego não foi encontrado!", 404);
        };

        if (job.empresaID !== userID) {
            throw new AppError("Você não é dono desse emprego!", 403);
        };

        if (job.status !== JOB_STATUS.ATIVA) {
            throw new AppError("Não é possível alterar o status desse emprego!", 409);
        };

        const allowedFields = [
            'titulo',
            'descricao',
            'area',
            'nivel',
            'tipoContrato',
            'tipoTrabalho',
            'cargaHoraria',
            'mediaSalario',
            'localizacao',
            'requisitos',
            'diferenciais',
            'beneficios',
            'corDestaque',
            'imgEmpresa',
            'qtdFuncionario'
        ];

        const filteredData = Object.keys(updateData).filter(key => allowedFields.includes(key)).reduce((obj, key) => {
            obj[key] = updateData[key];
            return obj;
        }, {});

        if (Object.keys(filteredData).length() === 0) {
            throw new AppError("Não foi enviado nenhum campo válido!", 400);
        };

        await Job.update(empregoID, filteredData);

        return { empregoID };
    };

    static async updateJobStatus({ userID, tipoUsuario, empregoID, status }) {
        if(tipoUsuario !== 'empresa'){
            throw new AppError("Usuário não autorizado!", 403)
        }
        
        const job = await Job.findById(empregoID);

        if(!job){
            throw new AppError("Vaga de emprego não encontrada!", 404);
        };

        if(job.empresaID !== userID){
            throw new AppError("Você não pode alterar essa vaga!", 403);
        };
    }
}