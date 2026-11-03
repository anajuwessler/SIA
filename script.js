document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const telInput = document.getElementById('telefone');
  const msgInput = document.getElementById('mensagem');
  const charCount = document.getElementById('charCount');
  const counterDisplay = document.getElementById('counterDisplay');

  // Atualizar contador de cadastros ao carregar a página
  atualizarContadorContatos();

  // 🏆 1. Máscara no Telefone: (00) 00000-0000
  telInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    e.target.value = v;
  });

  // 🏆 2. Contador de Caracteres na Mensagem
  msgInput.addEventListener('input', () => {
    const total = msgInput.value.length;
    charCount.textContent = `${total}/300`;
  });

  // Limpar mensagens de erro ao interagir com os campos
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
    input.addEventListener('change', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  // Validação e Submissão do Formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // 🚫 Evita o reload da página

    let isValid = true;

    function setError(groupId, hasErr) {
      const group = document.getElementById(groupId);
      if (hasErr) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    }

    // Validação dos Campos
    const nome = document.getElementById('nome').value.trim();
    setError('group-nome', nome.length < 3);

    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError('group-email', !emailRegex.test(email));

    const telefone = telInput.value.replace(/\D/g, '');
    setError('group-telefone', telefone.length < 10);

    const assunto = document.getElementById('assunto').value;
    setError('group-assunto', !assunto);

    const dataRetorno = document.getElementById('dataRetorno').value;
    setError('group-data', !dataRetorno);

    const perfilSelected = form.querySelector('input[name="perfil"]:checked');
    setError('group-perfil', !perfilSelected);

    const mensagem = msgInput.value.trim();
    setError('group-mensagem', mensagem.length < 10);

    const termos = document.getElementById('termos').checked;
    setError('group-termos', !termos);

    // Se estiver tudo ok ✅
    if (isValid) {
      const formData = {
        id: Date.now(),
        nome,
        email,
        telefone: telInput.value,
        assunto,
        dataRetorno,
        perfil: perfilSelected.value,
        mensagem,
        dataCadastro: new Date().toLocaleString('pt-BR')
      };

      // 💾 Salvar no localStorage
      const contatos = JSON.parse(localStorage.getItem('contatos') || '[]');
      contatos.push(formData);
      localStorage.setItem('contatos', JSON.stringify(contatos));

      // Exibir Modal de Sucesso + Preview dos dados
      exibirModalSucesso(formData);

      // Limpar formulário e contador
      form.reset();
      charCount.textContent = '0/300';

      // 🏆 Atualizar contador de contatos cadastrados
      atualizarContadorContatos();
    }
  });
});

function atualizarContadorContatos() {
  const contatos = JSON.parse(localStorage.getItem('contatos') || '[]');
  const count = contatos.length;
  const counterDisplay = document.getElementById('counterDisplay');
  if (counterDisplay) {
    counterDisplay.textContent = `${count} ${count === 1 ? 'cadastro salvo' : 'cadastros salvos'}`;
  }
}

function exibirModalSucesso(data) {
  const backdrop = document.getElementById('modalBackdrop');
  const preview = document.getElementById('savedDataPreview');

  preview.innerHTML = `
    <strong>Nome:</strong> ${data.nome}<br>
    <strong>E-mail:</strong> ${data.email}<br>
    <strong>Telefone:</strong> ${data.telefone}<br>
    <strong>Assunto:</strong> ${data.assunto} (${data.perfil})<br>
    <strong>Data Retorno:</strong> ${data.dataRetorno}
  `;

  backdrop.classList.add('active');
}

function fecharModal() {
  const backdrop = document.getElementById('modalBackdrop');
  backdrop.classList.remove('active');
}