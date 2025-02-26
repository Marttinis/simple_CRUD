//criar as instanciações e variaveis e atribuções
//pra fazer em uma linha só, daria pra fazer const app = require('express')()
//ou daria pra fazer const app = require('express'), mas teria que usar app().get ao inves de app.get

// const app = require("express")()
const express = require("express")
const app = express()
const PORT = 4000
const fs = require('fs')
let pokemons = require("./src/data/pokemons.json")
const { error } = require("console")
// const digimon = require("./src/data/digimon.json")
// const bakugan = require("./src/data/bakugan.json")

app.use(express.json());

//criar as requisições
// app.get("/",(req,res)=>{
//     res.send("Servidor tá fufando")
// })



const file_path = 'src/data/pokemons.json'
//abstração de uma função, no qual vai ser utlizada no crud 
function readPokemon() {
    const conteudo = fs.readFileSync(file_path);
    return JSON.parse(conteudo);
}

// função para escrever um pokemon novo no doc JSON
function writePokemon(pokemon) {
    // const udpatePokemon = JSON.stringify(pokemon)
    fs.writeFileSync(file_path, JSON.stringify(pokemon))
    console.log("Pokémon salvo com sucesso!", pokemon);

}



//CRUD
app.get("/pokemons", (req, res) => {
    res.send(readPokemon())


})

app.get("/pokemons/:id", (req, res) => {
    const pokemon = readPokemon();
    const id = req.params.id;
    const pok = pokemon.find((p) =>p.id === parseInt(id));
    if(!pok) return res.status(400).json({error: "Pokemon não encontrado"})
    res.json(pok)
})

app.post("/pokemons", (req, res) => {
    const body = req.body;
    const pokemon = readPokemon()
    // const newPokemon = body;
    const newPokemon = {
        id: pokemon.length ? pokemon[pokemon.length - 1 ].id + 1 : 1,
        name: body.name,
        type: body.type
    };
    pokemon.push(newPokemon);
    writePokemon(pokemon);
    res.status(201).json(newPokemon);
})


app.put("/pokemons/:id", (req, res) => {
    let pokemon = readPokemon()
    const index = pokemon.findIndex((p) =>p.id === parseInt(req.params.id))
    if(!index) return res.status(400).json({error: "Pokemon não encontrado"})

    pokemon[index] = {...pokemon[index], ...req.body};
    writePokemon(pokemon)
    res.status(201).json(pokemon[index])


})

app.delete("/pokemons/:id", (req, res) => {
    let pokemon = readPokemon();
    const removePokemon = pokemon.filter((p) => p.id !== parseInt(req.params.id))
    if(removePokemon.length === pokemon.length) return res.status(400).json({error: "Pokemon não encontrado"})
    
    writePokemon(removePokemon);
    res.json({message: "pokemon removido com sucesso"})

})


//startar o servidor
app.listen(PORT, () => {
    console.log(`Meu servidor está rodando http://localhost:${PORT}`);

})