pragma solidity ^0.8.7;

interface IRandomness {
    function randomNumber(uint) external view returns (uint);
    function getRandom(uint, uint) external;
}