const Resume = require('../model/resumeModel');
const Job = require('../model/jobModel');
const Application = require('../model/applicationModel');

class ApplicationService {
    static async applyToJob({ empregoID,
        userID,
        curriculoID,
        candidato_nome,
        candidato_email,
        candidato_telefone,
        candidato_localizacao,
        candidato_areaAtuacao,
        candidato_nivelExperiencia,
        candidato_linkedin,
        candidato_github,
        vaga_titulo,
        vaga_empresaNome,
        vaga_localizacao,
        vaga_area }) {

        const job = await Job.findById(empregoID);
        if (!job) {
            throw new Error('Não foi possivel localizar o emprego!');
        };

        if (job.status !== "ativo") {
            throw new Error('A vaga não está mais disponivel!');
        };

        const jobApplication = await Application.findByJobId(empregoID);
        const userAlreadyApplied = await Application.findByUserId(userID);
        if (jobApplication.userID === userAlreadyApplied.userID) {
            throw new Error('Usuário já aplicou para a vaga');
        };

        const userResume = await Resume.findById(curriculoID);
        if (!userResume) {
            throw new Error("O currículo não foi encontrado!");
        }
        const userResumeVerifier = await Resume.findByUserId(userID);
        if (!userResumeVerifier) {
            throw new Error("O currículo não foi encontrado!");
        }

        if (userResume.userID !== userResumeVerifier.userID) {
            throw new Error('O currículo não é seu!');
        };

        const applicationID = await Application.create({
            empregoID,
            userID,
            curriculoID,
            candidato_nome,
            candidato_email,
            candidato_telefone,
            candidato_localizacao,
            candidato_areaAtuacao,
            candidato_nivelExperiencia,
            candidato_linkedin,
            candidato_github,
            vaga_titulo,
            vaga_empresaNome,
            vaga_localizacao,
            vaga_area
        });

        return applicationID;
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

        if (tipoConta !== "empresa") {
            throw new Error("Você não pode acessar candidatos!");
        };

        const job = Job.findById(empregoID);

        if (!job) {
            throw new Error("O emprego não foi encontrado!");
        };
        if (job.empresaID !== userID) {
            throw new Error("O emprego não te pertence!");
        };

        const jobApplications = await Application.findByJobId(empregoID);
        return jobApplications;
    };
    static async updateApplicationStatus({ userID, tipoConta, candidaturaID, status }) {

        if (tipoConta !== "empresa") {
            throw new Error("credenciais inválidas!");
        };

        const application = await Application.findById(candidaturaID);

        if (!application) {
            throw new Error("A candidatura não existe!");
        };
        if (application.empresaID !== userID) {
            throw new Error("A vaga não é sua!");
        };
        if (application.status === 'aprovado' || application.status === 'rejeitado' || application.status === 'cancelado') {
            throw new Error("Não é mais possivel alterar o status!");
        };

        const job = await Job.findById(application.empregoID);

        if (!job) {
            throw new Error("Emprego não encontrado ou não existe mais!");
        };
        if (job.status !== 'ativo') {
            throw new Error("Emprego está encerrado ou não existe mais!");
        };

        if (application.status === "pendente" && status !== 'em_analise') {
            throw new Error("Não se é possivel pular etapas da aplicação!");
        };
        if (application.status === 'em_analise' && status !== 'aprovado' && status !== 'rejeitado') {
            throw new Error("Não é possivel voltar o status da aplicação!");
        };

        await Application.updateStatus(candidaturaID, status);
        return { candidaturaID, status }
    };

    static async cancelApplication({ userID, tipoConta, candidaturaID }) {
        if (tipoConta !== 'usuario') {
            throw new Error("Credenciais inválidos!");
        };

        const application = await Application.findById(candidaturaID);

        if (!application) {
            throw new Error("A candidatura não foi encontrada!");
        };
        if (application.userID !== userID) {
            throw new Error("Você não pode cancelar esse currículo!");
        };
        if (application.status === 'cancelado' || application.status === 'aprovado' || application.status === 'rejeitado') {
            throw new Error("Não é mais possivel alterar o status da aplicação!");
        };

        const status = 'cancelada';

        await Application.updateStatus(candidaturaID, status);

        return { candidaturaID, status };
    };

    static async getJobApplications({ userID, tipoConta, empregoID }) {
        if (tipoConta !== 'empresa') {
            throw new Error("Credenciais inválidos!");
        };

        const myJob = await Job.findById(empregoID);
        if (!myJob) {
            throw new Error("A vaga não foi encontrada!");
        };
        if (myJob.empresaID !== userID) {
            throw new Error("A vaga não é sua!");
        };

        const jobApplications = await Application.findByJobId(empregoID);
        return jobApplications;
    };

}

module.exports = ApplicationService