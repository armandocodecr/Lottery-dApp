import { LazyExoticComponent } from "react";
import { Tokens } from "../components/Pages";
import { Lottery, Winner } from "../components/Pages";

type JSXComponent = () => JSX.Element;

interface Route {
    to: string,
    path: string,
    Component: LazyExoticComponent<JSXComponent> | JSXComponent;
    name: string,
}

export const routes: Route[] = [
    {
        path: '/',
        to: '/',
        Component: Tokens,
        name: 'Tokens'
    },
    {
        path: '/lottery',
        to: '/lottery',
        Component: Lottery,
        name: 'Lottery'
    },
    {
        path: '/winner',
        to: '/winner',
        Component: Winner,
        name: 'Winner'
    },
]