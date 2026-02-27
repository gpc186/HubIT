const { JOB_STATUS, APPLICATION_STATUS } = require('../constants/status.constants');
const Resume = require('../model/resumeModel');
const Job = require('../model/jobModel');
const Application = require('../model/applicationModel');

class ApplicationService {
    static async applyToJob({ empregoID, userID, curriculoID }) {

        const job = await Job.findById(empregoID);
        if (!job) {
            throw new AppError('Não foi possivel localizar o emprego!', 404);
        };

        if (job.status !== JOB_STATUS.ATIVA) {
            throw new AppError('A vaga não está mais disponivel!', 404);
        };

        const userResume = await Resume.findById(curriculoID);

        if (!userResume || userResume.userID !== userID) {
            throw new AppError("O currículo não foi encontrado!", 404);
        }

        try {
            const applicationID = await Application.create({
                empregoID,
                userID,
                curriculoID,
                vaga_titulo: job.titulo,
                vaga_empresaNome: job.empresaNome,
                vaga_localizacao: job.localizacao,
                vaga_area: job.area,
                candidato_nome: userResume.nome,
                candidato_email: userResume.email,
                candidato_telefone: userResume.telefone,
                candidato_localizacao: userResume.localizacao,
                candidato_areaAtuacao: userResume.areaAtuacao,
                candidato_nivelExperiencia: userResume.nivelExperiencia,
                candidato_linkedin: userResume.linkedin,
                candidato_github: userResume.github,
                status: APPLICATION_STATUS.PENDENTE
            });

            return applicationID;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError('Usuário já aplicou para essa vaga', 409);
            };

            throw error;
        }
    };
    // TODO: filtros de applicações
    static async getUserApplications({ userID }) {
        const userApplication = await Application.findByUserId(userID);
        if (userApplication.length === 0) {
            return [];
        };
        return userApplication;
    };

    static async getCandidatesByJobId({ userID, tipoConta, empregoID }) {

        if (tipoUsuario !== "empresa") {
            throw new AppError("Você não pode acessar candidatos!", 403);
        };

        const job = await Job.findById(empregoID);

        if (!job) {
            throw new AppError("O emprego não foi encontrado!", 404);
        };
        if (job.empresaID !== userID) {
            throw new AppError("O emprego não te pertence!", 403);
        };

        const jobApplications = await Application.findByJobId(empregoID);
        return jobApplications;
    };
    static async updateApplicationStatus({ userID, tipoConta, candidaturaID, status }) {

        if (tipoUsuario !== "empresa") {
            throw new AppError("credenciais inválidas!", 403);
        };

        const application = await Application.findById(candidaturaID);

        if (!application) {
            throw new AppError("A candidatura não existe!", 404);
        };
        if (application.empresaID !== userID) {
            throw new AppError("A vaga não é sua!", 403);
        };
        if (application.status === APPLICATION_STATUS.APROVADO || application.status === APPLICATION_STATUS.REJEITADO || application.status === APPLICATION_STATUS.CANCELADO) {
            throw new AppError("Não é mais possivel alterar o status!", 409);
        };

        const job = await Job.findById(application.empregoID);

        if (!job) {
            throw new AppError("Emprego não encontrado ou não existe mais!", 404);
        };
        if (job.status !== JOB_STATUS.ATIVA) {
            throw new AppError("Emprego está encerrado ou não existe mais!", 404);
        };

        if (application.status === APPLICATION_STATUS.PENDENTE && status !== APPLICATION_STATUS.EM_ANALISE) {
            throw new AppError("Não se é possivel pular etapas da aplicação!", 409);
        };
        if (application.status === APPLICATION_STATUS.EM_ANALISE && ![APPLICATION_STATUS.APROVADO, APPLICATION_STATUS.REJEITADO].includes(status)) {
            throw new AppError("Não é possivel voltar o status da aplicação!", 409);
        };

        await Application.updateStatus(candidaturaID, status);

        return { candidaturaID, status }
    };

    static async cancelApplication({ userID, tipoUsuario, candidaturaID }) {
        if (tipoUsuario !== 'usuario') {
            throw new AppError("Credenciais inválidos!", 403);
        };

        const application = await Application.findById(candidaturaID);

        if (!application) {
            throw new AppError("A candidatura não foi encontrada!", 404);
        };
        if (application.userID !== userID) {
            throw new AppError("Você não pode cancelar esse currículo!", 403);
        };
        if (application.status === APPLICATION_STATUS.CANCELADO || application.status === APPLICATION_STATUS.APROVADO || application.status === APPLICATION_STATUS.REJEITADO) {
            throw new AppError("Não é mais possivel alterar o status da aplicação!", 409);
        };

        await Application.updateStatus(candidaturaID, APPLICATION_STATUS.CANCELADO);

        return { candidaturaID, status };
    };

    static async getJobApplications({ userID, tipoUsuario, empregoID }) {
        if (tipoUsuario !== 'empresa') {
            throw new AppError("Credenciais inválidos!", 403);
        };

        const myJob = await Job.findById(empregoID);
        if (!myJob) {
            throw new AppError("A vaga não foi encontrada!", 404);
        };
        if (myJob.empresaID !== userID) {
            throw new AppError("A vaga não é sua!", 403);
        };

        const jobApplications = await Application.findByJobId(empregoID);
        return jobApplications;
    };

}

module.exports = ApplicationService