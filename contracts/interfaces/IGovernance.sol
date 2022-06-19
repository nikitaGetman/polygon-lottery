pragma solidity ^0.8.7;

interface IGovernance {
    function lottery() external view returns (address);
    function randomness() external view returns (address);
}