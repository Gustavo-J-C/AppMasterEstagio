import React, {useState} from 'react'
import axios from 'axios'
import {pesquisacep} from '../src/CPFCheck'
import styles from '../styles/Home.module.css'

function App() {
    const [render, setRender] = useState(false)
    const [listForm, setListForm] = useState([])
    
    const fetchCEP = (e) => {
        pesquisacep(document.getElementById('cep').value)
    }

    const AddForm = () => {
        const list = listForm
        let amount = document.getElementById('amount')
        console.log(amount.value);
        let amountButton = document.getElementById('amountButton')
        if (amount.value > 0) {
            amount.readOnly = true;
            setListForm(list)
            setRender(true)
            amountButton.remove()
            for (let index = 0; index < amount.value; index++) {
                list.push(1)
            }
        }
    }
    
    function RenderForm() {
        return listForm.map(item => {
            return (
                <div className={styles.deviceField} key={Math.random() * 10000}>
                    <label >Tipo de equipamento: <br />
                        <select
                            required
                            name="type"
                            defaultValue=""
                            >
                            <option value="">Escolha uma opção</option>
                            <option value="notebook">Notebook</option>
                            <option value="desktop">Desktop</option>
                            <option value="netbook">Netbook</option>
                            <option value="screen">Monitor</option>
                            <option value="printer">Impressora</option>
                            <option value="scanner">Scanner</option>
                        </select>
                    </label> <br />
                    <label >Estado: <br />
                        <select
                            required
                            name="condition"
                            defaultValue=""
                            >
                            <option value="">Escolha uma opção</option>
                            <option value="working">Tem todas as partes, liga e funciona normalmente</option>
                            <option value="notWorking">Tem todas as partes, mas não liga mais</option>
                            <option value="broken">Faltam peças, funciona só as vezes ou está quebrado</option>
                        </select>
                    </label>
                </div>
        )})
    }

    function setDevices(form) {
        let newDevices = [];
        form["type"].forEach((element, index) => {
            newDevices.push({type: element.value, condition: form["condition"][index].value})
        });

        return newDevices
    }        

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const form = document.forms.personalDatas
        let {name, email, phone, cep, rua, bairro, cidade, uf, number, complement, amount} = form
        let devices;
        if (form['type']) {
            setRender(true);
            if (form["type"].length == form["amount"].value) {
                devices = setDevices(form)
            } else {
                devices = [{type: form['type'].value, condition: form['condition'].value}]
                console.log(devices);
            }
        } else {
            alert("É necessário adicionar equipamentos a serem doados")
            return
        }
       
        let user = email.value.substring(0, email.value.indexOf("@"));
        let domain = email.value.substring(email.value.indexOf("@")+ 1, email.value.length);
        
        if (email.value.length == 0) {
            
        } else if ((user.length >=1) &&
            (domain.length >=3) &&
            (user.search("@")==-1) &&
            (user.indexOf(".")==-1) &&
            (domain.search("@")==-1) &&
            (user.search(" ")==-1) &&
            (domain.search(" ")==-1) &&
            (domain.search(".")!=-1) &&
            (domain.indexOf(".") >=1)&&
            (domain.lastIndexOf(".") < domain.length - 1)) {
        }
        else{
            alert("E-mail invalido");
            return false
        }
        

        let a = document.forms.device
        let updateForm = {};
        axios.post('https://doar-computador-api.herokuapp.com/donation', {
            name: name.value,
            email: email.value, 
            phone: phone.value,
            complement: complement.value,
            zip: cep.value, 
            neighborhood: rua.value, 
            streetAddress: bairro.value, 
            city: cidade.value,
            number: phone.value,
            state: uf.value, 
            deviceCount: parseInt(amount.value),
            devices,
        }).then(function (response) {
            alert("formulario enviado com sucesso")
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            if (error.response.status == 400) {
                alert(error.response.data.errorMessage)
            } else {
            alert("O servidor falhou em responder tente mais tarde")
            }
        })
    }

    const handleNumber = (e) => {
        let target = e.target
        if (target.value <= 100) {
            target.value = target.value.replace(/[^0-9.]/g, ''); 
            target.value = target.value.replace(/(\..*)\./g, '$1')
        } else {
            target.value = 100
            alert('valor maximo permitido é de 100 dispositivos por vez')
        }
    }
    
    return (
        <div >
            <form  onSubmit={(e) => handleSubmit(e)} id="first" name="personalDatas">
                <div className={styles.formBox}>
                    <div className={styles.dataArea}>
                        <h2>Dados pessoais</h2>
                        <label >
                            Primeiro nome: <br />
                            <input defaultValue="" pattern="[a-z]{1,15}" required 
                            type="text" name="name" placeholder="digite seu nome"
                            title="Deve ser informado apenas o 1º nome sem espaços, numeros ou caracteres especiais apenas em letras minusculas "/>
                        </label> <br />
                        <label >
                            email: <br />
                            <input id="email" defaultValue="" placeholder="digite seu email" type="email" name="email" />
                        </label> <br />
                        <label >
                            telefone: <br />                        
                            <input defaultValue="" title="telefone deve conter apenas numeros ex: 71 999999999 ou 71 99999999" minLength="10" maxLength="12" required type="tel" placeholder="DD 9XXXXXXXX" pattern="[0-9]{2} [0-9]{8,9}" name="phone" />
                        </label> <br />
                        <label>
                            Cep: <br />
                            <input name="cep" placeholder="digite o CEP" required type="text" id="cep" defaultValue="" size="10" maxLength="9"/>
                            <button type="button" onClick={fetchCEP}>pesquisar</button>
                        </label><br />
                        <label>
                            Rua: <br />
                            <input name="rua" placeholder="digite o nome da rua" required type="text" id="rua" size="60" />
                        </label><br />
                        <label>
                            Bairro: <br />
                            <input name="bairro" placeholder="digite bairro" required type="text" id="bairro" size="40" />
                        </label><br />
                        <label>
                            Cidade: <br />
                            <input name="cidade" placeholder="digite a cidade" required type="text" id="cidade" size="40" />
                        </label><br />
                        <label>UF: <br />
                            <input name="uf" placeholder="digite codigo do estado" required minLength="2" maxLength="2" type="text" id="uf" size="2" />
                        </label><br />
                        <label>
                            Numero: <br />
                            <input name="number" placeholder="digite numero da residencia"required required type="text" id="number" />
                        </label><br />
                        <label>
                            Complemento: <br />
                            <input name="complement" placeholder="digite o complemento" required type="text" id="complement"/>
                        </label><br />
                    </div>

              
                    <div className={styles.devicesArea}>
                        <h2>Equipamentos</h2>
                        <label >Quantos equipamentos serão doados? :</label>
                        <input required type="number" min="0" max="100" onInput={(e) => handleNumber(e)} id="amount" name="amount" />
                        <button type="button" id="amountButton" className={styles.button} onClick={AddForm}>ok</button>
                        <div className={styles.devicesDiv}>
                            {render ? <RenderForm  /> : null}
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <button className={styles.button} type="submit">Enviar</button>
            </form>
        </div>
        );
    };
    
    export default App;


    // espaçamento entre campos, trava do tipo de dado que pode ser inserido (numero, texto), mensagem de erro quando algo de errado acontecer (exemplo: cep não encontrado), padronizaçao de campos (posicão de titulo, espaçamento, etc)