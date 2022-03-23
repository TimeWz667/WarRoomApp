import pandas as pd


__author__ = 'Chu-Chang Ku'
__all__ = []


class Projection:
    def __init__(self, scenario, ms: pd.DataFrame):
        self.Scenario = scenario
        self.Projection = dict(ms.iterrows())


class Simulator:
    def __inti__(self, model, post):
        self.Year0 = 2020
        self.Year1 = 2025

        self.Model = model
        self.Posteriors = post

    def simulate(self):
        return None



simulator = None

async def get_simulator():
    if simulator == None:
        model = None
        parameter = None

