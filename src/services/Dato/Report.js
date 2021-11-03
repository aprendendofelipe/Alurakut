const DatoURL = process.env.NEXT_PUBLIC_DATO_URL

export async function AddReport(report, authorization) {
    const reportCreated = await fetch('/api/report', {
        method: 'POST',
        headers: {
            Authorization: authorization || 'unauthenticated',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
    })
        .then((response) => response.json())
        .then((respostaCompleta) => {
            return respostaCompleta
        })
    return reportCreated
}


export async function CancelReport(reportId, authorization) {
    const report = { reportId: reportId.toString() }

    const reportCanceled = await fetch('/api/report', {
        method: 'DELETE',
        headers: {
            Authorization: authorization || 'unauthenticated',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
    })
        .then((response) => response.json())
        .then((respostaCompleta) => {
            return respostaCompleta
        })
        .catch(e => e)
    return reportCanceled
}