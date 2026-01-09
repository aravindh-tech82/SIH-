from scapy.all import IP, UDP, Raw, IKEv1, ISAKMP, ISAKMP_payload_SA, ISAKMP_payload_Proposal, ISAKMP_payload_Transform
from ikev3analytica.utils.logger import logger
import socket
import asyncio

class IKEv1Scanner:
    """IKEv1 Scanning and Enumeration Engine."""
    def __init__(self, target: str, port: int = 500):
        self.target = target
        self.port = port

    def create_sa_packet(self):
        """Creates a basic IKEv1 SA proposal packet."""
        # Define a simple transform: AES-CBC, SHA1, DH Group 2
        trans = ISAKMP_payload_Transform(transform_number=1,
                                         res=0,
                                         transform_id="KEY_IKE",
                                         SA_attr=[("Encryption", "AES-CBC"),
                                                  ("KeyLength", 128),
                                                  ("Hash", "SHA1"),
                                                  ("GroupDesc", "1024MODP"),
                                                  ("LifeType", "Seconds"),
                                                  ("LifeDuration", 28800)])
        
        prop = ISAKMP_payload_Proposal(proposal_number=1,
                                       proto="ISAKMP",
                                       trans_nb=1,
                                       trans=trans)
        
        sa = ISAKMP_payload_SA(prop=prop)
        
        # Build the ISAKMP header
        # i_cookie is a random initiator cookie
        import os
        i_cookie = os.urandom(8)
        isakmp = ISAKMP(init_cookie=i_cookie, next_payload="SA", exch_type="identity prot.", flags=0) / sa
        return isakmp

    async def scan(self):
        """Performs IKEv1 scan by sending an SA proposal."""
        logger.info(f"Scanning {self.target}:{self.port} for IKEv1...")
        
        packet = self.create_sa_packet()
        
        try:
            # We use a simple UDP socket for the scan to stay lightweight in the scanner
            loop = asyncio.get_event_loop()
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setblocking(False)
            sock.settimeout(2)
            
            await loop.sock_sendto(sock, bytes(packet), (self.target, self.port))
            
            data, addr = await loop.run_in_executor(None, sock.recvfrom, 4096)
            
            if data:
                response = ISAKMP(data)
                logger.info(f"[green]Received response from {addr}[/green]")
                return {
                    "protocol": "IKEv1",
                    "status": "Open",
                    "response": response.summary(),
                    "details": "IKEv1 service detected"
                }
        except socket.timeout:
            logger.warning(f"Timeout while scanning {self.target} for IKEv1.")
        except ConnectionRefusedError:
            logger.error(f"Connection refused by {self.target} on port {self.port}.")
        except Exception as e:
            logger.error(f"Error during IKEv1 scan: {str(e)}")
        
        return {"protocol": "IKEv1", "status": "Closed/Filtered"}
