import { request } from '@octokit/request'
export async function SetupRepoHooks(token: string, owner: string, repo: string) {
    let repo_id = -1

    const requestWithAuth = request.defaults({
        headers: {
            authorization: `token ${token}`,
        },
    })

    let webhooksAdded: string[] = []
    //Get the currently added hooks (we dont want to add more hooks than needed)
    try {
        const { data } = await requestWithAuth(`GET /repos/${owner}/${repo}/hooks`)
        for (let i = 0; i < data.length; i++) {
            webhooksAdded.push(data[i].events[0])
        }
    } catch (error) {
        console.log('error getting already registered webhooks')
        console.log(error)
        return repo_id
    }

    if (!webhooksAdded.includes('issues')) {
        try {
            const { data } = await requestWithAuth(`POST /repos/${owner}/${repo}/hooks`, {
                events: ['issues'],
                config: {
                    url: 'https://deliberate-proxy.loca.lt/webhook/github/issue',
                    insecure_ssl: 0,
                    events: ['issues'],
                },
            })
        } catch (error) {
            console.log('error setting up issues webhook')
            console.log(error)
            return repo_id
        }
    }

    if (!webhooksAdded.includes('milestone')) {
        try {
            const { data } = await requestWithAuth(`POST /repos/${owner}/${repo}/hooks`, {
                events: ['milestone'],
                config: {
                    url: 'https://deliberate-proxy.loca.lt/webhook/github/milestone',
                    insecure_ssl: 0,
                    events: ['milestone'],
                },
            })
            repo_id = data.id
        } catch (error) {
            console.log('error setting up issues webhook')
            console.log(error)
            return repo_id
        }
    }

    const { data } = await requestWithAuth(`GET /repos/${owner}/${repo}`)
    repo_id = data.id
    console.log(data)

    return repo_id
}
