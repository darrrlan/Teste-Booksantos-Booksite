from flask import Flask, Response, json
from models import db

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:admin@localhost:5432/gestao_reservas"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    data = {'message': 'API de Gestão do Booksite'}
    response = Response(json.dumps(data, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

if __name__ == '__main__':
    app.run(debug=True)