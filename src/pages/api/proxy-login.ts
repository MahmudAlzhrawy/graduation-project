// pages/api/proxy-login.ts

export default async function handler(req: { method: string; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  if (req.method === "POST") {
    const apiRes = await fetch("https://citypulse.runasp.net/api/User/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
