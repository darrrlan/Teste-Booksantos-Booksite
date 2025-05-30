from flask import Flask, Response, json
from models import db
from route import bp
from flask_cors import CORS

# Inicializa extensões
app = Flask(__name__)
CORS(app)

#configuração do banco de dados
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:admin@localhost:5432/gestao_reservas"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

#Registro da rotas estabelecidas
app.register_blueprint(bp)

#Criação da tabelas caso não exista
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)