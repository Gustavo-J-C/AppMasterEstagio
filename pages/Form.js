import React, {useState} from 'react'
import axios from 'axios'
import {pesquisacep, meu_callback} from '../src/CPFCheck'

function App() {
    const [formData, setFormData] = useState({devices: []})
    const [render, setRender] = useState(false)
    const [listForm, setListForm] = useState([])
    const [secondView, setSecondView] = useState(false);
    

    const fetchCEP = (e) => {
        pesquisacep(document.getElementById('cep').value)
    }

    const AddForm = () => {
        const list = listForm
        let amount = document.getElementById('amount')
        for (let index = 0; index < amount.value; index++) {
            list.push(1)
        }
        console.log(list);
        setListForm(list)
    }
    
    function RenderForm() {
        return listForm.map(item => {
            return (
                <div key={Math.random() * 10000}>
                <hr />
                <label >Dispositivo:</label>
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
                <label >Estado:</label>
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
                </div>
        )})
    }

    function handleRender() {
        let button = document.getElementById("amountButton");
        button.remove();
        setRender(true);
    }

    function setDevices(form, count) {
        console.log('dentro do laço');

        let newDevices = [];
        form["type"].forEach((element, index) => {
            newDevices.push({type: element.value, condition: form["condition"][index].value})
        });

        return newDevices
        console.log("devices :", newDevices);
    }        

    

    const handleSubmit = (event) => {
        event.preventDefault();
        event.preventDefault(); 

        let form = document.forms.personalDatas
        let devices;
        if (form['type']) {
            if (form["type"].length == form["amount"].value) {
                devices = setDevices(form)
            } else {
                devices = [{type: form['type'].value, condition: form['condition'].value}]
                console.log(devices);
            }
        } else {
            return
        }
       
        let {name, email, phone, cep, rua, bairro, cidade, uf, number, complement} = form
        let a = document.forms.device
        let updateForm = {};
        console.log("posting datas: ",formData);
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
            deviceCount: 1,
            devices,
        }).then(function (response) {
            alert("formulario enviado com sucesso")
            console.log(response);
        })
        .catch(function (error) {
            console.log(error.response);
            if (error.response.status == 400) {
                alert("Os dados " + error.response.data.requiredFields + " não foram preenchidos corretamente")
            } else {
            alert("O servidor falhou em responder tente mais tarde")
            }
        })
        
        
        setFormData(formData => ({...formData, ...updateForm}));
        // PostDatas(updateForm);
    }
    
    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e)} id="first" name="personalDatas">
                <div>
                    <h2>Dados pessoais</h2>
                    <div>
                    <label >nome completo:</label>
                        <input defaultValue="" required type="text" name="name" />
                    </div>
                    <label >email:</label>
                    <div>
                        <input defaultValue="" type="email" name="email" />
                    </div>
                    <label >telefone:</label>
                    <div>
                        <input defaultValue="123" minLength="10" maxLength="12" required type="tel" placeholder="Digite o seu numero com ddd" name="phone" />
                    </div>
                </div>
            
                <h2>Dados postais</h2>
                <label>Cep:
                    <input name="cep" required type="text" id="cep" defaultValue="" size="10" maxLength="9"/>
                    <button type="button" onClick={fetchCEP} >pesquisar</button>
                    <span></span>
                </label><br />
                <label>Rua:
                <input name="rua" required type="text" id="rua" size="60" /></label><br />
                <label>Bairro:
                <input name="bairro" required type="text" id="bairro" size="40" /></label><br />
                <label>Cidade:
                <input name="cidade" required type="text" id="cidade" size="40" /></label><br />
                <label>UF:
                <input name="uf" required minLength="2" maxLength="2" type="text" id="uf" size="2" /></label><br />
                <label>Numero:
                <input name="number" required required type="text" id="number" /></label><br />
                <label>Complemento:
                <input name="complement" required type="text" id="complement"/></label><br />

            <hr />
            
                <h2>Equipamentos</h2>
                <label >Quantos equipamentos serão doados? :</label>
                <input required type="number" id="amount" name="amount" />
                <button type="button" id="amountButton" onClick={() => {AddForm(), handleRender()}}>ok</button>
                <button type="reset">reset</button>
                {render ? <RenderForm /> : null}

                <br />
                <br />
                <button type="reset">reset</button>
                <button type="submit">proxima Aba</button>
            </form>
        </div>
        );
    };
    
    export default App;