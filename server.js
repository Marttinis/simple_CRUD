const express = require("express")
const app = express()

const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();

const cor = require("cors");
app.use(cors());

const PORT = 4000
app.use(express.json());

app.get("/filme", async (req, res) =>{
    const filmes = await prisma.filme.findMany();
    res.json(filmes)
} )

app.get("/filme/:id", async (req,res) => {
    const id = req.params.id
    const filme = await prisma.filme.findUnique({ where: {id} })
    if (!filme) return res.status(400).json({error: "filme não encontrado"})

    res.json(filme);
})

app.post("/filme" , async (req,res) =>{
    const body = req.body;
    const newFilme = await prisma.filme.create(body)

    res.status(201).json(newFilme);
})


app.listen(PORT, () =>{
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    
})