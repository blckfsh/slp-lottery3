SLP Lottery => wip
===========

Decentralized app lottery that accepts SampleToken (an ERC-20 Standard Token) as a bet.
The amount of token send to the deposit address is/are equivalent to the number of entries.
Every 24 hours, we will automatically spin the wheel to select the winner based on the entries.

Soon, we will implement that this app, accepts SLP as the bet instead of the a SampleToken.

Packages used so far
--------------------
1. [@ethereumjs/tx](https://www.npmjs.com/package/@ethereumjs/tx)
1. [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom)
2. [@testing-library/react](https://www.npmjs.com/package/@testing-library/react)
3. [@testing-library/user-event](https://www.npmjs.com/package/@testing-library/user-event)
4. [@truffle/hdwallet-provider](https://www.npmjs.com/package/@truffle/hdwallet-provider)
5. [abi-decoder](https://www.npmjs.com/package/abi-decoder)
6. [axios](https://www.npmjs.com/package/axios)
7. [babel-polyfill](https://www.npmjs.com/package/babel-polyfill)
8. [babel-register](https://www.npmjs.com/package/babel-register)
9. [bootstrap](https://www.npmjs.com/package/bootstrap)
10. [buffer](https://www.npmjs.com/package/buffer)
11. [chai](https://www.npmjs.com/package/chai)
12. [chai-as-promised](https://www.npmjs.com/package/chai-as-promised)
13. [chai-bignumber](https://www.npmjs.com/package/chai-bignumber)
14. [classnames](https://www.npmjs.com/package/classnames)
15. [dotenv](https://www.npmjs.com/package/dotenv)
16. [moment](https://www.npmjs.com/package/moment)
17. [qrcode](https://www.npmjs.com/package/qrcode)
18. [react](https://www.npmjs.com/package/react)
19. [react-custom-roulette](https://www.npmjs.com/package/react-custom-roulette)
20. [react-datepicker](https://www.npmjs.com/package/react-datepicker)
21. [react-dom](https://www.npmjs.com/package/react-dom)
22. [react-modal](https://www.npmjs.com/package/react-modal)
23. [react-router-dom](https://www.npmjs.com/package/react-router-dom)
24. [react-scripts](https://www.npmjs.com/package/react-scripts)
25. [react-table](https://www.npmjs.com/package/react-table)
26. [react-toastify](https://www.npmjs.com/package/react-toastify)
27. [sass](https://www.npmjs.com/package/sass)
28. [set-interval-async](https://www.npmjs.com/package/set-interval-async)
29. [truffle-flattener](https://www.npmjs.com/package/truffle-flattener)
30. [web-vitals](https://www.npmjs.com/package/web-vitals)
30. [web3](https://www.npmjs.com/package/web3)

Smart Contract Functions
------------------------

1. ERC20 Token Standard Features - `totalSupply`, `balanceOf`, `allowance`, `transfer`, `approve`, `transferFrom`, `burn`, `burnFrom`

Test Script - Truffle
---------------------

Make sure you test blockchain environment is running. In this instance, I used `Ganache`. Then run the script...
```
truffle test
```

Deploying the smart contract - Truffle
--------------------------------------

To deploy the smart contracts on your test blockchain environment, type...
```
truffle migrate --reset
```

To run the react app, type...
```
npm start
```

Creator
-------
@blckfsh. 2022. All rights reserved.
