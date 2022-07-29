import axios from 'axios'

export function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('cep').value=("");
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('uf').value=("");
}



export function meu_callback(data) {
    if (!data.erro) {
        console.log("data: ",data);
        //Atualiza os campos com os valores.
        document.getElementById('cep').value=(data.cep)
        document.getElementById('rua').value=(data.logradouro);
        document.getElementById('bairro').value=(data.bairro);
        document.getElementById('cidade').value=(data.localidade);
        document.getElementById('uf').value=(data.uf);
        document.getElementById('amount').focus();
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

export async function pesquisacep(valor) {

    console.log("valor: ", valor);
    //Nova variável "cep" somente com dígitos.
    var cep = valor ? valor.replace(/\D/g, '') : "";

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            
            //Preenche os campos com "..." enquanto consulta webservice.
            
            document.getElementById('rua').value="...";
            document.getElementById('bairro').value="...";
            document.getElementById('cidade').value="...";
            document.getElementById('uf').value="...";
            
            //Sincroniza com o callback.
            try {
                let src = await axios('https://viacep.com.br/ws/'+ cep + '/json/');
                console.log(src.data);
                meu_callback(src.data)
            } catch (error) {
                console.log("log src: ",error);
                limpa_formulário_cep();
                alert("Falha com a conexão. \nFavor preencha os dados a mão");
            }
        } 
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};