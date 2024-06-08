class BalancoController {
  public async getAllBalancos(): Promise<any[]> {
    try {
      const response = await fetch('http://localhost:8080/balanco')

      const jsonResponse = await response.json()

      return jsonResponse
    } catch (e) {
      return []
    }
  }

  public async findByDescricaoValor(descricao: string, valor: number): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:8080/balanco/${descricao}/${valor}`)

      const jsonResponse = await response.json()

      return jsonResponse
    } catch (e) {
      return []
    }
  }

  public async insertVocabulo(balanco: any): Promise<boolean> {
    const request = await fetch('http://localhost:8080/balanco', {
      method: 'POST',
      body: JSON.stringify(balanco),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return request.status == 200 || request.status == 204
  }
}

export default new BalancoController()
