export function handleCriaComunidade(e, loginGithub) {
    e.preventDefault();
    const dadosDoForm = new FormData(e.target);

    const comunidade = {
        title: dadosDoForm.get('title'),
        imageUrl: dadosDoForm.get('image'),
        creatorSlug: loginGithub,
    }

    fetch('/api/comunidades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comunidade)
    })
        .then(async (response) => {
            const dados = await response.json();
            const comunidade = dados.registroCriado;
            const comunidadesAtualizadas = [...comunidades, comunidade];
            setComunidades(comunidadesAtualizadas)
        })
}