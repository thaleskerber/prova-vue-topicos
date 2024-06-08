<script setup lang="ts">
import { onMounted, ref } from 'vue'
import balancoController from '../api/BalancoController'

interface BalancoList {
  id: number
  descricao: string
  dataHora: string
  valor: string
}

interface Busca {
  descricao: string
  valor: string
}

const state = ref({
  balancos: [] as BalancoList[],
  novoBalanco: {} as Omit<Omit<BalancoList, 'id'>, 'dataHora'>,
  busca: { descricao: '', valor: '' } as Busca
})

async function getBalancos() {
  const response = await balancoController.getAllBalancos()

  const balancos = response.map((i) => {
    return {
      id: i.id,
      descricao: i.descricao,
      dataHora: i.dataHora,
      valor: `${i.valor} ${i.valor > 0 ? 'C' : 'D'}`
    }
  })

  state.value.balancos = balancos
}

onMounted(() => {
  getBalancos()
})

function setBuscaDescricao(e: any) {
  state.value.busca = { ...state.value.busca, descricao: e.target.value }
}

function setBuscaValor(e: any) {
  state.value.busca = { ...state.value.busca, valor: e.target.value }
}

function setDescricao(e: any) {
  state.value.novoBalanco = { ...state.value.novoBalanco, descricao: e.target.value }
}

function setValor(e: any) {
  state.value.novoBalanco = { ...state.value.novoBalanco, valor: e.target.value }
}

async function salvar() {
  // validação se precisar

  const response = await balancoController.insertVocabulo(state.value.novoBalanco)

  if (response) {
    getBalancos()
    state.value.novoBalanco = {
      descricao: '',
      valor: ''
    }
  }
}

async function search() {
  const response = await balancoController.findByDescricaoValor(
    state.value.busca.descricao,
    parseInt(state.value.busca.valor)
  )

  const balancos = response.map((i) => {
    return {
      id: i.id,
      descricao: i.descricao,
      dataHora: i.dataHora,
      valor: `${i.valor} ${i.valor > 0 ? 'C' : 'D'}`
    }
  })

  state.value.balancos = balancos
}

function limpar() {
  getBalancos()
  state.value.busca = { descricao: '', valor: '' }
}
</script>

<template>
  <main>
    <h1>Gerencie Vocábulos</h1>
    <div class="margem">
      <input
        :value="state.busca.descricao"
        placeholder="Buscar por descrição"
        @input="setBuscaDescricao"
      />
      <input
        :value="state.busca.valor"
        placeholder="Buscar por valor"
        type="number"
        @input="setBuscaValor"
      />
      <button @click="limpar">Limpar</button>
      <button @click="search">Pesquisar</button>
    </div>
    <table class="margem">
      <thead>
        <td>Id</td>
        <td>Descrição</td>
        <td>Data/Hora</td>
        <td>Valor</td>
      </thead>
      <tbody>
        <tr v-if="state.balancos.length === 0">
          <td colspan="5">Nenhum registro foi encontrado para os critérios fornecidos.</td>
        </tr>
        <tr :key="bal.id" v-for="bal in state.balancos">
          <td>{{ bal.id }}</td>
          <td>{{ bal.descricao }}</td>
          <td>{{ bal.dataHora }}</td>
          <td>{{ bal.valor }}</td>
        </tr>
      </tbody>
    </table>
    <div class="margem">
      <input :value="state.novoBalanco.descricao" placeholder="Descrição" @input="setDescricao" />
      <input :value="state.novoBalanco.valor" placeholder="Valor" type="number" @input="setValor" />
      <button @click="salvar">Salvar</button>
    </div>
  </main>
</template>

<style>
.margem {
  margin-top: 20px;
}
</style>
