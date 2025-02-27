const express = require("express")
const app = express()

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// const cor = require("cors");
// app.use(cors());

const PORT = 4000
app.use(express.json());

app.get("/filme", async (req, res) => {
    const filmes = await prisma.filme.findMany();
    res.json(filmes)
})

app.get("/filme/:id", async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        const filme = await prisma.filme.findUnique({ where: { id } })
        if (!filme) return res.status(404).json({ error: "filme não encontrado" })

        res.json(filme);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar o filme", error: error.message })

    }

})

app.post("/filme", async (req, res) => {
    try {
        const body = req.body;

        if (!body.titulo || !body.ano_lancamento || !body.categoria || !body.preco) {
            return res.status(400).json({
                message: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }

        const newFilme = await prisma.filme.create({ data: body })
        res.status(201).json(newFilme);

    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar o filme" });

    }

})


app.put("/filme/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;

        if (!body.titulo || !body.ano_lancamento || !body.categoria || !body.preco) {
            return res.status(400).json({
                message: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }

        const updateFilme = await prisma.filme.update({ data: body, where: { id } })

        res.status(200).json({ messsage: "Filme atualizado com sucesso" })

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o filme" });

    }

})


app.delete("/filme/:id", async (req, res) => {
    try {

        const id = parseInt(req.params.id)
        const filmeExiste = await prisma.filme.findUnique({ where: { id } })

        if (!filmeExiste) return res.status(400).json({ error: "filme não encontrado" })

        await prisma.filme.delete({ where: { id } });
        res.status(200).json({ message: "Filme excluido com sucesso" })

    } catch (error) {
        res.status(500).json({ error: "Erro ao excluir o filme" });

    }
})


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);

})