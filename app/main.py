from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import data, simulation

__author__ = 'Chu-Chang Ku'
__all__ = ['app']


app = FastAPI()

app.include_router(data.router)
app.include_router(simulation.router)

app.mount('/static', StaticFiles(directory='../data'), name='static')


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='127.0.0.1', port=1166, log_level='info', reload=True)
