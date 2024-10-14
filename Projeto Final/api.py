from flask import Flask, jsonify, Response, request
import json

app = Flask(__name__)
app.config['RESTFUL_JSON'] = {
    'ensure_ascii': False,
    'default': lambda obj: json.dumps(obj)
}

# Carregando dados dos recursos
with open('recursos.json', encoding='utf-8') as f:
    recursos = json.load(f)

# Carregando dados dos usuarios
with open('usuarios.json', encoding='utf-8') as f:
    usuarios = json.load(f)

# Função auxiliar para encontrar um recurso por código
def get_recurso_por_codigo(codigo):
    return next((recurso for recurso in recursos if recurso['codigo'] == codigo), None)

@app.route('/api/recursos', methods=['GET', 'POST'])
def gerenciar_recursos():
    if request.method == 'GET':
        tipo_recurso = request.args.get('tipo')
        codigo = request.args.get('codigo')

        if tipo_recurso:
            filtrados = [item for item in recursos if item['tipo'] == tipo_recurso]
            return jsonify(filtrados)
        elif codigo:
            recurso = get_recurso_por_codigo(codigo)
            if recurso:
                return jsonify(recurso)
            else:
                return jsonify({"erro": f"Recurso não encontrado com o código {codigo}"}), 404
        else:
            return jsonify(recursos)

    elif request.method == 'POST':
        novo_recurso = request.json
        recursos.append(novo_recurso)
        return jsonify(novo_recurso), 201

@app.route('/api/recursos/<string:codigo>', methods=['GET', 'PUT', 'DELETE'])
def manipular_recurso_individual(codigo):
    recurso = get_recurso_por_codigo(codigo)

    if not recurso:
        return jsonify({"erro": f"Recurso não encontrado com o código {codigo}"}), 404

    if request.method == 'GET':
        return jsonify(recurso)

    elif request.method == 'PUT':
        dados_atuais = request.json
        recurso.update(dados_atuais)
        return jsonify(recurso), 200

    elif request.method == 'DELETE':
        recursos.remove(recurso)
        return '', 204

@app.route('/api/recursos/<string:tipo_recurso>', methods=['GET'])
def get_dados_por_tipo(tipo_recurso):
    filtrados = [item for item in recursos if item['tipo'] == tipo_recurso]
    return jsonify(filtrados)

@app.route('/api/usuarios')
def get_usuarios():
    return Response(json.dumps(usuarios), mimetype='application/json; charset=utf-8')

@app.route('/api/usuarios/<string:nome_usuario>')
def get_usuario(nome_usuario):
    usuario_encontrado = next((usuario for usuario in usuarios if usuario['usuario'].lower() == nome_usuario.lower()), None)
    if usuario_encontrado:
        return jsonify(usuario_encontrado)
    else:
        return jsonify({"erro": "Usuário não encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True)
