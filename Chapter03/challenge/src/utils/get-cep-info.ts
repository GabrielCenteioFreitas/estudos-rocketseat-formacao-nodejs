import { env } from "@/env";

type CepResponse = {
  localidade?: string;
  estado?: string;
}

export async function getCepInfo(cep: string): Promise<CepResponse | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const cepData = await response.json() as CepResponse;
    return cepData;
  } catch (error) {
    if (env.NODE_ENV !== 'prod') {
      console.error("Error fetching CEP:", error);
    }
    return null;  // Retorna null em caso de erro
  }
}