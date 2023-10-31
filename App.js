import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [paciente, setPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [consultas, setConsultas] = useState([]);

  // Função para atualizar os estados ao salvar os campos do formulário
  function aoSalvar(evento) {
    const { name, value } = evento.target;
    if (name === 'data') {
      setData(value);
    } else if (name === 'hora') {
      setHora(value);
    } else if (name === 'paciente') {
      setPaciente(value);
    } else if (name === 'medico') {
      setMedico(value);
    }
  }

  // Função para salvar uma consulta
  function SalvarConsulta() {
    const carga = {
      data: data,
      hora: hora,
      paciente: paciente,
      medico: medico,
    };

    axios.post('http://localhost:3000/agendamentos', carga)
      .then((resposta) => {
        console.log(resposta);
        // Aqui você pode adicionar lógica adicional, se necessário.
      });
  }

  // Função para marcar uma consulta como concluída
  function alterarConsulta(id) {
    const carga = {
      concluida: 1,
    };

    axios.patch(`http://localhost:3000/agendamentos/${id}`, carga)
      .then((resposta) => {
        console.log(resposta);
        // Aqui você pode adicionar lógica adicional, se necessário.
      });
  }

  // Carregar a lista de consultas ao montar o componente
  useEffect(() => {
    axios.get('http://localhost:3000/agendamentos')
      .then((resposta) => {
        setConsultas(resposta.data);
      });
  }, []);

  return (
    <div>
      <form className="form-container">
        <label>Data:</label><br />
        <input className="input-field" type="text" name="data" onChange={aoSalvar} /><br />
        <label>Hora:</label><br />
        <input className="input-field" type="text" name="hora" onChange={aoSalvar} /><br />
        <label>Paciente:</label><br />
        <input className="input-field" type="text" name="paciente" onChange={aoSalvar} /><br />
        <label>Médico:</label><br />
        <input className="input-field" type="text" name="medico" onChange={aoSalvar} /><br />
        <button className="input-button" onClick={SalvarConsulta}>Agendar Consulta</button>
      </form>

      <div>
        <ul className="consultas-list">
          {consultas.map((consulta) => (
            <li className="consulta-item" key={consulta.id}>
              {consulta.data} - {consulta.hora} - {consulta.paciente} - {consulta.medico}
              <button className="complete-button" onClick={() => alterarConsulta(consulta.id)}>Consulta Concluída</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
