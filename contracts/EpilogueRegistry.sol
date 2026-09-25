// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Epilogue — BOT Chain registry for advice mints & safety report hashes.
 * Deploy on BOT Chain Testnet (968) / Mainnet (677) via Remix + MetaMask.
 */
contract EpilogueRegistry {
    struct AdviceRecord {
        address minter;
        string category;
        string contentHash;
        uint256 timestamp;
    }

    struct SafetyReport {
        address reporter; // address(0) when isAnonymous
        string reportHash;
        bool isAnonymous;
        uint256 timestamp;
    }

    AdviceRecord[] private _adviceRecords;
    SafetyReport[] private _safetyReports;

    /// @dev Prevents logging the same report hash twice (tamper-evident anchor).
    mapping(bytes32 => bool) private _reportHashUsed;

    event AdviceMinted(
        address indexed minter,
        string category,
        string contentHash,
        uint256 indexed recordId,
        uint256 timestamp
    );

    event SafetyReportLogged(
        address indexed reporter,
        string reportHash,
        bool isAnonymous,
        uint256 indexed recordId,
        uint256 timestamp
    );

    /**
     * @param category   e.g. "resilience", "productivity"
     * @param contentHash SHA-256 hex from Laravel (64 chars, with or without "0x")
     */
    function mintAdvice(string calldata category, string calldata contentHash) external {
        require(bytes(contentHash).length >= 64, "Invalid content hash");
        require(bytes(category).length > 0, "Empty category");

        uint256 id = _adviceRecords.length;
        _adviceRecords.push(
            AdviceRecord({
                minter: msg.sender,
                category: category,
                contentHash: contentHash,
                timestamp: block.timestamp
            })
        );

        emit AdviceMinted(msg.sender, category, contentHash, id, block.timestamp);
    }

    /**
     * @param reportHash   SHA-256 hex from Laravel — never the raw report text
     * @param isAnonymous  if true, reporter stored as address(0) on-chain
     */
    function logSafetyReport(string calldata reportHash, bool isAnonymous) external {
        require(bytes(reportHash).length >= 64, "Invalid report hash");

        bytes32 key = keccak256(bytes(reportHash));
        require(!_reportHashUsed[key], "Report hash already logged");
        _reportHashUsed[key] = true;

        address reporter = isAnonymous ? address(0) : msg.sender;

        uint256 id = _safetyReports.length;
        _safetyReports.push(
            SafetyReport({
                reporter: reporter,
                reportHash: reportHash,
                isAnonymous: isAnonymous,
                timestamp: block.timestamp
            })
        );

        emit SafetyReportLogged(reporter, reportHash, isAnonymous, id, block.timestamp);
    }

    function adviceCount() external view returns (uint256) {
        return _adviceRecords.length;
    }

    function safetyReportCount() external view returns (uint256) {
        return _safetyReports.length;
    }

    function getAdviceRecord(uint256 id)
        external
        view
        returns (address minter, string memory category, string memory contentHash, uint256 timestamp)
    {
        AdviceRecord storage r = _adviceRecords[id];
        require(id < _adviceRecords.length, "Invalid id");
        return (r.minter, r.category, r.contentHash, r.timestamp);
    }

    function getSafetyReport(uint256 id)
        external
        view
        returns (address reporter, string memory reportHash, bool isAnonymous, uint256 timestamp)
    {
        SafetyReport storage r = _safetyReports[id];
        require(id < _safetyReports.length, "Invalid id");
        return (r.reporter, r.reportHash, r.isAnonymous, r.timestamp);
    }
}