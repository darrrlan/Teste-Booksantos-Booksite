from flask import Flask, Response, json

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:admin@localhost:5432/gestao_reservas"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

@app.route('/')
def home():
    data = {'message': 'API de Gestão do Booksite'}
    response = Response(json.dumps(data, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

if __name__ == '__main__':
    app.run(debug=True)